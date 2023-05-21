const express = require('express');
const app = express();
const { Firestore } = require('@google-cloud/firestore');
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Initialize Firestore
//const firestore = new Firestore();
const firestore = new Firestore({
    projectId: 'helpmeow',
    keyFilename: 'helpmeow-d1b6a0de601c.json',
  });

// API endpoint to fetch data from Firestore
// app.get('/data', async (req, res) => {
//   try {
//     const collectionRef = firestore.collection('your-collection');
//     const snapshot = await collectionRef.get();

//     const data = snapshot.docs.map((doc) => doc.data());
//     res.json(data);
//   } catch (error) {
//     res.status(500).send('Error retrieving data from Firestore: ' + error);
//   }
// });

//output with id
app.get('/data', async (req, res) => {
  try {
    const collectionRef = firestore.collection('your-collection');
    const snapshot = await collectionRef.get();

    const data = snapshot.docs.map((doc) => {
      const documentData = doc.data();
      return { id: doc.id, ...documentData };
    });

    res.json(data);
  } catch (error) {
    res.status(500).send('Error retrieving data from Firestore: ' + error);
  }
});

// API endpoint to get a specific document by ID from Firestore
app.get('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const documentRef = firestore.collection('your-collection').doc(id);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const documentData = documentSnapshot.data();
    res.json({ id: documentSnapshot.id, ...documentData });
  } catch (error) {
    res.status(500).send('Error retrieving document from Firestore: ' + error);
  }
});

// API endpoint to create a new document in Firestore
app.post('/data', async (req, res) => {
  try {
    const { field1, field2 } = req.body; // Adjust the field names as per your data structure
    const documentRef = firestore.collection('your-collection').doc();
    
    await documentRef.set({ field1, field2 }); // Adjust the field names as per your data structure
    
    res.status(201).json({ message: 'Document created successfully' });
  } catch (error) {
    res.status(500).send('Error creating document in Firestore: ' + error);
  }
});

// Update all field harus diisi
// app.put('/data/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { field1, field2 } = req.body; // Adjust the field names as per your data structure
    
//     const documentRef = firestore.collection('your-collection').doc(id);
//     await documentRef.update({ field1, field2 }); // Adjust the field names as per your data structure
    
//     res.json({ message: 'Document updated successfully' });
//   } catch (error) {
//     res.status(500).send('Error updating document in Firestore: ' + error);
//   }
// });

// API endpoint to update an existing document in Firestore
app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.body.field1) {
      updateData.field1 = req.body.field1;
    }

    if (req.body.field2 !== undefined) {
      updateData.field2 = req.body.field2;
    }

    const documentRef = firestore.collection('your-collection').doc(id);
    await documentRef.update(updateData);

    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    res.status(500).send('Error updating document in Firestore: ' + error);
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const documentRef = firestore.collection('your-collection').doc(id);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    await documentRef.delete();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting document from Firestore: ' + error);
  }
});



// Start the API server
app.listen(3000, () => {
  console.log('API server running on port 3000');
});
