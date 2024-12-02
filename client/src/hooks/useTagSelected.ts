import { useEffect, useState, useCallback } from 'react';
import { getTagByName } from '../services/tagService';
import { Tag, TagData } from '../types';

/**
 * Custom hook to manage the state and logic for the selected tag.
 * It fetches the tag data based on the provided tag name and updates the state accordingly.
 *
 * @param {TagData} t - The tag data containing the name of the tag to be fetched.
 * @returns {Object} - An object containing the tag state and a function to set the tag state.
 */
const useTagSelected = (t: TagData) => {
  const [tag, setTag] = useState<Tag>({
    name: '',
    description: '',
  });

  /**
   * Fetch the tag data by name and update the state.
   * If an error occurs, set the tag state to an error state.
   */
  const fetchData = useCallback(async () => {
    try {
      const res = await getTagByName(t.name);
      setTag(res || { name: 'Error', description: 'Error' });
    } catch (e) {
      throw new Error('Error while fetching tag data');
    }
  }, [t.name]);

  useEffect(() => {
    // Only fetch if the name is different from the current tag
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
