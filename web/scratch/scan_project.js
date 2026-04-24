const projectId = 'b6iov2to';
const token = 'skhHFRyvAKT6OIcYP1INKlzpftjILJvMwo98mwwVm05aGUKmu7f5AKn80K2lXBEsWduuUMNJ7imVPJKAMO1CzuHgkM3bcBgcenE3TFYDaWnbafZMvaMmoPdPjfUf0PCWNd3zOp1jE7JuCqndxSPyerf83EXoHe1cgJM9S5k6UZA0a8zYWbqF';

async function scanProject() {
    console.log('📡 SCANNING PROJECT:', projectId);
    
    try {
        const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/datasets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const datasets = await response.json();
        console.log('📬 CLOUD RESPONSE:', JSON.stringify(datasets, null, 2));

        if (!Array.isArray(datasets)) {
            console.error('❌ ERROR: Data returned is not an array. Check project ID and token.');
            return;
        }
        
        console.log('📑 DATASETS FOUND:', datasets.map(d => d.name));
        
        for (const ds of datasets) {
            const countRes = await fetch(`https://${projectId}.api.sanity.io/v2026-03-11/data/query/${ds.name}?query=count(*)`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const count = await countRes.json();
            console.log(`📊 Dataset [${ds.name}] has ${count.result} total documents.`);
        }
    } catch (err) {
        console.error('❌ SCAN FAILED:', err.message);
    }
}

scanProject();
