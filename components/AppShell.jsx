'use client';
import { useApp } from '../context/AppContext';
import LoaderView from './LoaderView';
import SearchModal from './modals/SearchModal';
import BookmarksModal from './modals/BookmarksModal';
import TransModal from './modals/TransModal';
import ExplanationModal from './modals/ExplanationModal';
import Completion from './modals/Completion';
import Doaa from './modals/Doaa';
import Azkar from './modals/Azkar';
import Tasbih from './modals/Tasbih';

export default function AppShell({ children }) {
  const { modal, isLoading } = useApp();
  return (
    <>
      {children}
      {modal.name === 'search' && <SearchModal />}
      {modal.name === 'bookmarks' && <BookmarksModal />}
      {modal.name === 'trans' && <TransModal />}
      {modal.name === 'explanation' && <ExplanationModal />}
      {modal.name === 'completion' && <Completion />}
      {modal.name === 'doaa' && <Doaa />}
      {modal.name === 'azkar' && <Azkar />}
      {modal.name === 'tasbih' && <Tasbih />}
      {isLoading && <LoaderView />}
    </>
  );
}
