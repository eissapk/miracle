'use client';
import { useApp } from '../../context/AppContext';
import ModalSlot from '../ModalSlot';

export default function ExplanationModal() {
  const { modal } = useApp();
  const transObj = { muyassar: 'الميسر', jalalayn: 'الجلالين' };
  const text = modal.data?.text || '';
  const explainer = transObj[modal.data?.explainer] || '';

  return (
    <ModalSlot name="explanation">
      <div className="pl-[10px]">
        <h3 className="modal-heading m-0 border-b-2 border-[#6a11cb] inline-block pb-[5px] mb-[20px] text-[#333]">
          تفسير {explainer}
        </h3>
        <p className="modal-text text-[#666] m-0 leading-[25px]">{text}</p>
      </div>
    </ModalSlot>
  );
}
