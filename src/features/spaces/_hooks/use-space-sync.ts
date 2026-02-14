// [職責] 同步 Firestore 資料。
// 這個 Hook 將負責設定 onSnapshot 監聽器，從 Firestore 訂閱子集合的變更，並透過 dispatch 更新狀態。
import { useEffect } from 'react';

import { collection, onSnapshot, query, Firestore } from 'firebase/firestore';

import { LocalAction } from '@/features/spaces/_context/space-context';

interface UseSpaceSyncProps {
  db: Firestore | null;
  spaceId: string;
  dispatch: React.Dispatch<LocalAction>;
}

export const useSpaceSync = ({ db, spaceId, dispatch }: UseSpaceSyncProps) => {
  useEffect(() => {
    if (!db || !spaceId) {
      dispatch({ type: 'RESET_STATE' });
      return;
    }

    const unsubs: (() => void)[] = [];

    const collectionsToSync = ['tasks', 'issues', 'files'];

    collectionsToSync.forEach(collectionName => {
      const q = query(collection(db, "spaces", spaceId, collectionName));
      const unsub = onSnapshot(q, (snap) => {
        const actionType = `SET_${collectionName.toUpperCase()}` as LocalAction['type'];
        dispatch({ type: actionType, payload: snap });
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [db, spaceId, dispatch]);
};
