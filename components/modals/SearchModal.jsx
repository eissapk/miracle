'use client';
import ModalSlot from '../ModalSlot';
import SearchEngine from '../SearchEngine';
import { useApp } from '../../context/AppContext';

export default function SearchModal() {
  const { setModal } = useApp();
  const hideModal = () => setModal({ name: '', data: null });

  return (
    <ModalSlot name="search">
      <SearchEngine onHideModal={hideModal} />
    </ModalSlot>
  );
}
