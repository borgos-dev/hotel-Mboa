// All photos live here. They are free-licence Unsplash photos loaded straight from the Unsplash CDN.
// To change a picture, replace the photo id in the URL (or point to a file in /public).
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroSlides = [
  { src: u("photo-1566073771259-6a8506099945", 2000), title: "Where every stay becomes a story", kicker: "Welcome to Hôtel Mboa" },
  { src: u("photo-1445019980597-93fa8acb246c", 2000), title: "Comfort, calm and a view to remember", kicker: "Douala · Cameroon" },
  { src: u("photo-1542314831-068cd1dbfeeb", 2000), title: "Rooms designed for rest", kicker: "From single rooms to suites" },
];

export const aboutImages = [
  u("photo-1564501049412-61c2a3083791", 1200),
  u("photo-1551882547-ff40c63fe5fa", 1200),
];

export const roomImages: Record<string, string[]> = {
  Single: [u("photo-1611892440504-42a792e24d32", 1200)],
  Double: [u("photo-1618773928121-c32242e63f39", 1200)],
  Family: [u("photo-1590490360182-c33d57733427", 1200)],
  Suite: [u("photo-1582719478250-c89cae4dc85b", 1200)],
};
export const fallbackRoomImage = u("photo-1551882547-ff40c63fe5fa", 1200);

export const serviceImages: Record<string, string> = {
  "Spa & Wellness": u("photo-1540555700478-4be289fbecef", 900),
  Restaurant: u("photo-1517248135467-4c7edcad34c4", 900),
  "Fitness Gym": u("photo-1534438327276-14e5300c3a48", 900),
  "Airport Shuttle": u("photo-1449965408869-eaa3f722e40d", 900),
};
