'use client';
import { useApp } from '../../context/AppContext';
import ModalSlot from '../ModalSlot';

export default function TransModal() {
  const { modal } = useApp();
  const transObj = { ahmedraza: 'Ahmed raza' };
  const text = modal.data?.text || '';
  const translator = transObj[modal.data?.translator] || '';

  return (
    <ModalSlot name="trans">
      <div className="pl-[10px] [direction:ltr] text-left">
        <h3 className="modal-heading m-0 border-b-2 border-[#6a11cb] inline-block pb-[5px] mb-[20px] text-[#333]">
          {translator} translation
        </h3>
        <p className="modal-text text-[#666] m-0 leading-[25px]">{text}</p>
      </div>
    </ModalSlot>
  );
}
