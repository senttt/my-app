import React, { useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../backend/firebase"; // Ensure this correctly points to your Firebase config

const db = getFirestore(app);

function FirestoreSchemaFetcher() {
  const [schema, setSchema] = useState([]);

  const fetchSchema = async () => {
    try {
      const rootCollections = ["bookings", "units", "honestyStorePurchases"]; // 🔥 Replace with your Firestore collection names
      const schemaData = [];

      for (const colName of rootCollections) {
        const colRef = collection(db, colName);
        const snapshot = await getDocs(colRef);
        const docs = snapshot.docs.slice(0, 5).map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        schemaData.push({ collection: colName, documents: docs });
      }

      setSchema(schemaData);
      console.log("Firestore Schema:", schemaData);
    } catch (error) {
      console.error("Error fetching schema:", error);
    }
  };

  return (
    <div>
      <h2>Firestore Schema Viewer</h2>
      <button onClick={fetchSchema}>Fetch Schema</button>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
}

export default FirestoreSchemaFetcher;
