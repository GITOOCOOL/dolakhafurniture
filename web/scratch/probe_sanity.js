const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "b6iov2to",
  dataset: "production",
  apiVersion: "2026-03-11",
  useCdn: false,
  token:
    "skhHFRyvAKT6OIcYP1INKlzpftjILJvMwo98mwwVm05aGUKmu7f5AKn80K2lXBEsWduuUMNJ7imVPJKAMO1CzuHgkM3bcBgcenE3TFYDaWnbafZMvaMmoPdPjfUf0PCWNd3zOp1jE7JuCqndxSPyerf83EXoHe1cgJM9S5k6UZA0a8zYWbqF",
});

const id = 'e7fffdfd-715e-40ca-88af-29d5db9788b2';

async function probe() {
    console.log('📡 PERFORMING DEEP PAYLOAD INSPECTION...');
    console.log('🎯 TARGET ID:', id);
    
    try {
        const doc = await client.fetch(`*[_id == $id || _id == "drafts." + $id][0]`, { id });
        
        if (doc) {
            console.log('✅ PAYLOAD RETRIEVED:');
            console.log(JSON.stringify(doc, null, 2));
        } else {
            console.log('🚫 PAYLOAD EMPTY. Even with a direct fetch, it returns null.');
            
            // Try one more thing: search by title
            const searchByTitle = await client.fetch(`*[_type == "socialMedia" && (title == "test" || name == "test")][0]`);
            if (searchByTitle) {
                console.log('💡 FOUND BY TITLE INSTEAD! REAL ID IS:', searchByTitle._id);
            }
        }

    } catch (err) {
        console.error('❌ INSPECTION FAILED:', err.message);
    }
}

probe();
