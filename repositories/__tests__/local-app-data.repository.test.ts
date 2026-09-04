import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalAppDataRepository } from '@/repositories/local-app-data.repository';
import { LOCAL_USER_ID } from '@/types/domain';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('LocalAppDataRepository', () => {
  let repository: LocalAppDataRepository;
  beforeEach(async () => { await AsyncStorage.clear(); repository = new LocalAppDataRepository(); });

  it('carga y restaura los datos de demostración', async () => {
    const data = await repository.load();
    expect(data.products).toHaveLength(6);
    expect(data.entries.every((entry) => entry.userId === LOCAL_USER_ID)).toBe(true);
  });

  it('actualiza la entrada sin duplicar un producto idéntico', async () => {
    const id = await repository.saveProduct(LOCAL_USER_ID, { name: ' Queso curado de oveja ', brand: 'Hacendado', establishmentId: 'est-mercadona', rating: 5, reviewText: 'Mejor', isFavorite: true, images: [], categoryIds: ['cat-cheese'] });
    const data = await repository.load();
    expect(id).toBe('prod-cheese');
    expect(data.products).toHaveLength(6);
    expect(data.entries.find((entry) => entry.productId === id)).toMatchObject({ rating: 5, isFavorite: true, reviewText: 'Mejor' });
  });

  it('impide borrar una categoría con descendientes', async () => {
    await expect(repository.deleteCategory(LOCAL_USER_ID, 'cat-asian')).rejects.toThrow('subcategorías');
  });

  it('activa y desactiva el favorito de la entrada personal', async () => {
    await repository.toggleFavorite(LOCAL_USER_ID, 'prod-gyoza', true);
    expect((await repository.load()).entries.find((entry) => entry.productId === 'prod-gyoza')?.isFavorite).toBe(true);
    await repository.toggleFavorite(LOCAL_USER_ID, 'prod-gyoza', false);
    expect((await repository.load()).entries.find((entry) => entry.productId === 'prod-gyoza')?.isFavorite).toBe(false);
  });

  it('no permite marcar como favorito un producto fuera del diario', async () => {
    await expect(repository.toggleFavorite(LOCAL_USER_ID, 'inexistente', true)).rejects.toThrow('todavía no está');
  });

  it('impide ciclos y nombres hermanos repetidos', async () => {
    await expect(repository.saveCategory(LOCAL_USER_ID, { id: 'cat-asian', name: 'Comida asiática', parentId: 'cat-gyoza' })).rejects.toThrow('ciclo');
    await expect(repository.saveCategory(LOCAL_USER_ID, { name: ' quesos ' })).rejects.toThrow('Ya existe');
  });

  it('crea, edita y elimina un establecimiento sin productos', async () => {
    const id = await repository.saveEstablishment(LOCAL_USER_ID, { name: 'Café nuevo', type: 'cafe', images: [] });
    await repository.saveEstablishment(LOCAL_USER_ID, { id, name: 'Café editado', type: 'cafe', images: [] });
    expect((await repository.load()).establishments.find((item) => item.id === id)?.name).toBe('Café editado');
    await repository.deleteEstablishment(LOCAL_USER_ID, id);
    expect((await repository.load()).establishments.some((item) => item.id === id)).toBe(false);
  });

  it('impide eliminar establecimientos que contienen productos', async () => {
    await expect(repository.deleteEstablishment(LOCAL_USER_ID, 'est-mercadona')).rejects.toThrow('todavía tiene productos');
  });

  it('crea y elimina una categoría hoja y sus asignaciones', async () => {
    const id = await repository.saveCategory(LOCAL_USER_ID, { name: 'Temporal' });
    await repository.deleteCategory(LOCAL_USER_ID, id);
    expect((await repository.load()).categories.some((item) => item.id === id)).toBe(false);
  });

  it('actualiza el perfil conservando sus datos estructurales', async () => {
    await repository.saveProfile(LOCAL_USER_ID, { displayName: 'Esther nueva', username: 'esther2', email: 'nuevo@example.com', bio: 'Bio' });
    expect((await repository.load()).profile).toMatchObject({ id: LOCAL_USER_ID, displayName: 'Esther nueva', username: 'esther2', email: 'nuevo@example.com', bio: 'Bio' });
  });

  it('elimina el producto, la entrada y sus relaciones en modo demostración', async () => {
    await repository.deleteProduct(LOCAL_USER_ID, 'prod-cheese');
    const data = await repository.load();
    expect(data.products.some((item) => item.id === 'prod-cheese')).toBe(false);
    expect(data.entries.some((item) => item.productId === 'prod-cheese')).toBe(false);
    expect(data.entryCategories.some((item) => item.entryId === 'entry-cheese')).toBe(false);
  });
});
