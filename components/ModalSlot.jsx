'use client';
import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function ModalSlot({ name, hide, children }) {
  const { setModal } = useApp();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const elmRef = useRef(null);

  const hideModal = () => {
    if (elmRef.current) {
      elmRef.current.classList.add('hide');
      setTimeout(() => setModal({ name: '', data: null }), 200);
    }
  };

  useEffect(() => {
    document.body.classList.add('overflow');
    return () => document.body.classList.remove('overflow');
  }, []);

  useEffect(() => {
    if (name === 'bookmark' && hide) hideModal();
  }, [hide]);

  useEffect(() => {
    const nav = navRef.current;
    const container = containerRef.current;
    if (!nav || !container) return;

    let isDown = false;
    let startY, currentY, walkY;
    let direction = '';
    let distance = 0;
    const threshold = Math.round(window.innerHeight / 3);

    function reset() {
      nav.classList.remove('addLayer');
      isDown = false;
      if (distance >= threshold && direction === 'bottom') {
        container.classList.remove('pauseAnimation');
        hideModal();
      } else if (distance < threshold) {
        container.style.transform = 'translate3d(0,5vh,0)';
      }
      nav.removeEventListener('touchmove', dragMove);
      nav.removeEventListener('touchend', dragEnd);
      nav.removeEventListener('mousemove', dragMove);
      nav.removeEventListener('mouseup', dragEnd);
    }

    function dragEnd() { reset(); }

    function dragMove(e) {
      if (!isDown) return;
      currentY = e.type.includes('mouse') ? e.clientY : Math.round(e.touches[0].clientY);
      walkY = currentY - startY;
      direction = walkY > 0 ? 'bottom' : 'top';
      distance = Math.abs(walkY);
      if (distance <= threshold && direction === 'bottom') {
        if (!container.classList.contains('pauseAnimation')) container.classList.add('pauseAnimation');
        container.style.transform = `translate3d(0,calc(5vh + ${walkY}px), 0)`;
      }
    }

    function dragStart(e) {
      nav.classList.add('addLayer');
      e.stopPropagation();
      isDown = true;
      startY = e.type.includes('mouse') ? e.clientY : Math.round(e.touches[0].clientY);
      nav.addEventListener('mousemove', dragMove);
      nav.addEventListener('mouseup', dragEnd);
      nav.addEventListener('mouseleave', reset);
      nav.addEventListener('touchmove', dragMove);
      nav.addEventListener('touchend', dragEnd);
    }

    nav.addEventListener('touchstart', dragStart);
    nav.addEventListener('mousedown', dragStart);
    return () => {
      nav.removeEventListener('touchstart', dragStart);
      nav.removeEventListener('mousedown', dragStart);
    };
  }, []);

  return (
    <div
      className="modal-root fixed inset-0 bg-black/30 z-[9999]"
      ref={elmRef}
    >
      <div
        className="modal-box modal-inner-box relative bg-[#fdf8f0] h-[95vh] w-full left-0 rounded-t-[30px] border border-[#e8dcc8] px-[10px] pb-[10px] pt-0 shadow-sm max-w-[560px] mx-auto"
        style={{ transform: 'translate3d(0,5vh,0)' }}
        ref={containerRef}
      >
        <nav
          className="relative overflow-hidden pb-[15px] pt-[10px] cursor-grab before:absolute before:content-[''] before:left-0 before:right-0 before:mx-auto before:w-[50px] before:h-[3px] before:bg-[#c8b090] before:rounded-[5px]"
          ref={navRef}
        >
          {/* <button className="o-btn close z-[9999] float-left mt-[5px] ml-[5px]" onClick={hideModal} /> */}
        </nav>
        <div className="clear-both h-[calc(100%-45px)] overflow-auto mx-[10px] scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
