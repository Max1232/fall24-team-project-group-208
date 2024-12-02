import { useEffect, useState, useCallback } from 'react';
import { getTagByName } from '../services/tagService';
import { Tag, TagData } from '../types';

const useTagSelected = (t: TagData) => {
  const [tag, setTag] = useState<Tag>({
    name: '',
    description: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await getTagByName(t.name);
      setTag(res || { name: 'Error', description: 'Error' });
    } catch (e) {
      console.error('Error fetching tag:', e);
    }
  }, [t.name]);

  useEffect(() => {
    // Only fetch if the name is different from current tag
    if (t.name && t.name !== tag.name) {
      fetchData();
    }
  }, [t.name, fetchData, tag.name]);

  return {
    tag,
    setTag,
  };
};

export default useTagSelected;