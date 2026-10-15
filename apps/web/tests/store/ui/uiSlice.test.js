import {
  onCloseDateModal,
  onOpenDateModal,
  toggleModal,
  uiSlice,
} from '../../../src/store/ui/uiSlice';

describe('Tests on ui slice', () => {
  test('Should return default state', () => {
    expect(uiSlice.getInitialState().isDateModalOpen).toBeFalsy();
  });

  test('Should change isDateModalOpen', () => {
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer(state, onOpenDateModal());

    expect(state.isDateModalOpen).toBeTruthy();

    // Change to false again
    state = uiSlice.reducer(state, onCloseDateModal());

    expect(state.isDateModalOpen).toBeFalsy();

    // Toggle isDateModalOpen
    state = uiSlice.reducer(state, toggleModal());
    expect(state.isDateModalOpen).toBeTruthy();
  });
});
