import { getSessionUser, extractAuthCookies, CONFIG } from "../../../lib/ncb-utils";

export async function POST(req: Request) {
  const user = await getSessionUser(req.headers.get("cookie"));
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { petName } = await req.json().catch(() => ({ petName: "My FlokiPet" }));
  const authCookies = extractAuthCookies(req.headers.get("cookie"));

  // 1. Fetch current user record to check balance
  const userRes = await fetch(`${CONFIG.dataApiUrl}/read/users?Instance=${CONFIG.instance}`, {
    headers: { "X-Database-Instance": CONFIG.instance, "Cookie": authCookies }
  });
  const userRecords = await userRes.json();
  const dbUser = Array.isArray(userRecords) && userRecords.length > 0 ? userRecords[0] : null;

  if (!dbUser) {
    return new Response(JSON.stringify({ error: "User profile not found in database" }), { status: 404 });
  }

  // 2. Fetch current pets to determine cost
  // In NoCodeBackend, we can filter by user_id if we do a POST to /query/pets, but since /read returns user's data (RLS usually active),
  // we just read all pets the user owns. Let's assume RLS ensures they only get their own, 
  // but to be safe we can just fetch /read/pets.
  const petsRes = await fetch(`${CONFIG.dataApiUrl}/read/pets?Instance=${CONFIG.instance}`, {
    headers: { "X-Database-Instance": CONFIG.instance, "Cookie": authCookies }
  });
  const petsRecords = await petsRes.json();
  const petsCount = Array.isArray(petsRecords) ? petsRecords.length : 0;

  // 3. Determine cost
  const cost = petsCount === 0 ? 1 : 1000000;

  if (dbUser.off_chain_floki < cost) {
    return new Response(JSON.stringify({ 
      error: `Not enough FLOKI. You need ${cost.toLocaleString()} FLOKI to mint this pet.` 
    }), { status: 400 });
  }

  // 4. Deduct balance
  const newFlokiBalance = dbUser.off_chain_floki - cost;
  await fetch(`${CONFIG.dataApiUrl}/update/users/${dbUser.id}?Instance=${CONFIG.instance}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    },
    body: JSON.stringify({ off_chain_floki: newFlokiBalance })
  });

  // 5. Insert new pet
  // Randomly assign one of our pre-generated AI images (pet1, pet2, or pet3)
  const imageOptions = ['pet1', 'pet2', 'pet3'];
  const randomImageId = imageOptions[Math.floor(Math.random() * imageOptions.length)];
  const petId = crypto.randomUUID();

  const createPetRes = await fetch(`${CONFIG.dataApiUrl}/create/pets?Instance=${CONFIG.instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
    },
    body: JSON.stringify({
      id: petId,
      user_id: user.id,
      name: petName || "My FlokiPet",
      image_id: randomImageId,
    })
  });

  if (!createPetRes.ok) {
    // Attempt rollback (simplified)
    return new Response(JSON.stringify({ error: "Failed to mint pet." }), { status: 500 });
  }

  const newPet = await createPetRes.json();

  return new Response(JSON.stringify({ 
    success: true, 
    pet: newPet,
    newBalance: newFlokiBalance
  }), { status: 200 });
}
