// [職責] 同步 Firestore 資料。
// 這個 Hook 將負責設定 onSnapshot 監聽器，從 Firestore 訂閱子集合的變更，並透過 dispatch 更新狀態。
import { useEffect } from 'react';
import { collection, onSnapshot, query, Firestore } from 'firebase/firestore';
import { LocalAction } from '@/features/workspaces/_context/workspace-context';

interface UseWorkspaceSyncProps {
  db: Firestore | null;
  workspaceId: string;
  dispatch: React.Dispatch<LocalAction>;
}

export const useWorkspaceSync = ({ db, workspaceId, dispatch }: UseWorkspaceSyncProps) => {
  useEffect(() => {
    if (!db || !workspaceId) {
      dispatch({ type: 'RESET_STATE' });
      return;
    }

    const unsubs: (() => void)[] = [];

    const collectionsToSync = ['tasks', 'issues', 'files'];

    collectionsToSync.forEach(collectionName => {
      const q = query(collection(db, "workspaces", workspaceId, collectionName));
      const unsub = onSnapshot(q, (snap) => {
        const actionType = `SET_${collectionName.toUpperCase()}` as LocalAction['type'];
        dispatch({ type: actionType, payload: snap });
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [db, workspaceId, dispatch]);
};
