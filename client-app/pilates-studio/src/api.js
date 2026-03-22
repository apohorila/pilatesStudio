
import API_BASE_URL from './config.js';

export const fetchClassTypes = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/classtypes`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch class types');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching class types:', error);
  }
};
 

export const handleDeleteClassType = async (id) => {
  await fetch(`${API_BASE_URL}/api/classtypes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  setClassTypes(classTypes.filter(ct => ct.id !== id)); // remove from list without refetching
};