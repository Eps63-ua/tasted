import { AppData, LOCAL_USER_ID } from '@/types/domain';

const now = '2026-08-03T12:00:00.000Z';
const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const seedData: AppData = {
  profile: { id: LOCAL_USER_ID, username: 'esther', displayName: 'Esther', email: 'esther@example.com', bio: 'Guardando sabores que merecen repetirse.', avatarUri: image('photo-1494790108377-be9c29b29330'), createdAt: now, updatedAt: now },
  establishments: [
    { id: 'est-mercadona', createdBy: LOCAL_USER_ID, name: 'Mercadona', type: 'supermarket', locationText: 'Alicante', description: 'Supermercado habitual.', coverImageUri: image('photo-1578916171728-46686eac8d58'), images: [image('photo-1578916171728-46686eac8d58')], createdAt: '2026-07-01T10:00:00Z', updatedAt: now },
    { id: 'est-lidl', createdBy: LOCAL_USER_ID, name: 'Lidl', type: 'supermarket', locationText: 'Alicante', coverImageUri: image('photo-1604719312566-8912e9227c6a'), images: [image('photo-1604719312566-8912e9227c6a')], createdAt: '2026-07-03T10:00:00Z', updatedAt: now },
    { id: 'est-gelato', createdBy: LOCAL_USER_ID, name: 'La Romana', type: 'ice_cream_shop', locationText: 'Centro', description: 'Heladería artesanal.', coverImageUri: image('photo-1501443762994-82bd5dace89a'), images: [image('photo-1501443762994-82bd5dace89a')], createdAt: '2026-07-05T10:00:00Z', updatedAt: now },
    { id: 'est-bistro', createdBy: LOCAL_USER_ID, name: 'Bistro Norte', type: 'restaurant', locationText: 'Plaza Mayor', description: 'Cocina casual y producto local.', coverImageUri: image('photo-1515003197210-e0cd71810b5f'), images: [image('photo-1515003197210-e0cd71810b5f')], createdAt: '2026-07-08T10:00:00Z', updatedAt: now },
  ],
  products: [
    ['prod-cheese','est-mercadona','Queso curado de oveja','Hacendado','Intenso y firme','photo-1486297678162-eb2a19b0a32d'],
    ['prod-gyoza','est-lidl','Gyozas de pollo','Vitasia','Crujientes por fuera','photo-1525755662778-989d0524087e'],
    ['prod-gelato','est-gelato','Helado de pistacho','La Romana','Pistacho tostado','photo-1560008581-09826d1de69e'],
    ['prod-drink','est-mercadona','Kombucha de limón','Komvida','Bebida fresca','photo-1544145945-f90425340c7e'],
    ['prod-burger','est-bistro','Hamburguesa Norte','Bistro Norte','Carne, queso y cebolla','photo-1568901346375-23c9450c58cd'],
    ['prod-bread','est-lidl','Pan de masa madre','Lidl','Corteza crujiente','photo-1509440159596-0249088772ff'],
  ].map(([id, establishmentId, name, brand, description, photo], index) => ({ id, createdBy: LOCAL_USER_ID, establishmentId, name, brand, description, coverImageUri: image(photo), images: [image(photo)], createdAt: `2026-07-${10 + index}T10:00:00Z`, updatedAt: now })),
  entries: [
    ['entry-cheese','prod-cheese',4.5,true,5.75,'Potente y muy equilibrado.'], ['entry-gyoza','prod-gyoza',4,false,3.49,'Perfectas para una cena rápida.'], ['entry-gelato','prod-gelato',5,true,3.8,'Cremoso y con sabor real a pistacho.'], ['entry-drink','prod-drink',3.5,false,2.5,'Ácida y refrescante.'], ['entry-burger','prod-burger',4.5,true,13.5,'Jugosa, repetiría.'], ['entry-bread','prod-bread',4,false,2.25,'Muy buena corteza.'],
  ].map(([id, productId, rating, isFavorite, pricePaid, reviewText], index) => ({ id: String(id), userId: LOCAL_USER_ID, productId: String(productId), rating: Number(rating), isFavorite: Boolean(isFavorite), pricePaid: Number(pricePaid), reviewText: String(reviewText), currencyCode: 'EUR', triedAt: `2026-07-${12 + index}`, visibility: 'private' as const, createdAt: `2026-07-${12 + index}T12:00:00Z`, updatedAt: now })),
  categories: ([
    ['cat-cheese','Quesos',undefined], ['cat-bread','Pan',undefined], ['cat-drinks','Bebidas',undefined], ['cat-ice','Helados',undefined], ['cat-asian','Comida asiática',undefined], ['cat-gyoza','Gyozas','cat-asian'], ['cat-chicken-gyoza','Gyozas de pollo','cat-gyoza'],
  ] as [string, string, string | undefined][]).map(([id, name, parentId]) => ({ id, userId: LOCAL_USER_ID, name, parentId, createdAt: now, updatedAt: now })),
  entryCategories: [
    ['entry-cheese','cat-cheese'], ['entry-gyoza','cat-asian'], ['entry-gyoza','cat-gyoza'], ['entry-gyoza','cat-chicken-gyoza'], ['entry-gelato','cat-ice'], ['entry-drink','cat-drinks'], ['entry-bread','cat-bread'],
  ].map(([entryId, categoryId]) => ({ entryId, categoryId, userId: LOCAL_USER_ID })),
};
