import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Button, ConfirmDialog, FavoriteButton, RatingStars } from '@/components/ui/app-ui';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null, Heart: () => null, ImagePlus: () => null, Minus: () => null,
  Plus: () => null, Search: () => null, Star: () => null, Trash2: () => null, X: () => null,
}));

describe('componentes críticos', () => {
  it('ejecuta una acción de botón y respeta disabled', () => {
    const action = jest.fn();
    const screen = render(<Button title="Guardar" onPress={action} />);
    fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));
    expect(action).toHaveBeenCalledTimes(1);
    screen.rerender(<Button title="Guardar" disabled onPress={action} />);
    fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('muestra los errores de acciones asíncronas sin dejarlos sin manejar', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const screen = render(<Button title="Guardar" onPress={async () => { throw new Error('Supabase no responde'); }} />);
    fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(alert).toHaveBeenCalledWith('No se pudo completar la acción', 'Supabase no responde'));
    alert.mockRestore();
  });

  it('exige una confirmación destructiva explícita', () => {
    const cancel = jest.fn(), confirm = jest.fn();
    const screen = render(<ConfirmDialog visible title="Eliminar" message="Esta acción no se puede deshacer" onCancel={cancel} onConfirm={confirm} />);
    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.press(screen.getByRole('button', { name: 'Eliminar' }));
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('mantiene la valoración entre 0.5 y 5', () => {
    const change = jest.fn();
    const screen = render(<RatingStars value={0.5} onChange={change} />);
    fireEvent.press(screen.getByLabelText('Bajar media estrella'));
    expect(change).toHaveBeenLastCalledWith(0.5);
    screen.rerender(<RatingStars value={5} onChange={change} />);
    fireEvent.press(screen.getByLabelText('Subir media estrella'));
    expect(change).toHaveBeenLastCalledWith(5);
  });

  it('expone el corazón como favorito accesible', () => {
    const change = jest.fn();
    const screen = render(<FavoriteButton active={false} onPress={change} />);
    fireEvent.press(screen.getByRole('button', { name: 'Añadir a favoritos' }));
    expect(change).toHaveBeenCalledTimes(1);
    screen.rerender(<FavoriteButton active onPress={change} />);
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' }).props.accessibilityState.checked).toBe(true);
  });
});
