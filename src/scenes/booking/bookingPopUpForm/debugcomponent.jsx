import { useEffect, useState } from "react";
import { db } from "../../../backend/firebase"; // Ensure this path is correct
import { doc, getDoc } from "firebase/firestore";

const DebugComponent = () => {
  const [unitData, setUnitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        console.log("📡 Starting Firestore Fetch...");

        // 🔹 Define the correct document reference
        const unitRef = doc(db, "units", "pRfB91gOh7iAdpIJHhdT");
        console.log("📌 Fetching document: units/pRfB91gOh7iAdpIJHhdT");

        // 🔹 Retrieve the document
        const docSnap = await getDoc(unitRef);

        // 🔹 Check if the document exists
        if (!docSnap.exists()) {
          const notFoundError =
            "❌ ERROR: Document 'pRfB91gOh7iAdpIJHhdT' NOT found in collection 'units'.";
          console.error(notFoundError);
          setError(notFoundError);
          return;
        }

        console.log("✅ Document Found:", docSnap.data());

        // 🔹 Extract the settings field
        const data = docSnap.data();
        if (!data.settings) {
          const settingsError =
            "⚠️ WARNING: 'settings' field is MISSING in the document!";
          console.warn(settingsError);
          setError(settingsError);
          return;
        }

        // 🔹 Extract the platforms field inside settings
        if (!data.settings.platforms) {
          const platformsError =
            "⚠️ WARNING: 'platforms' field is MISSING inside 'settings'!";
          console.warn(platformsError);
          setError(platformsError);
          return;
        }

        console.log("✅ Platforms Data Retrieved:", data.settings.platforms);
        setUnitData(data.settings.platforms);
      } catch (err) {
        console.error("🚨 CRITICAL ERROR: Firestore fetch failed!", err);
        setError(`Firestore Error: ${err.message}`);
      }
    };

    fetchUnitData();
  }, []);

  return (
    <div>
      <h2>New Booking</h2>
      <h3>Unit Data Debugging</h3>
      {error ? (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      ) : null}
      <pre>{JSON.stringify(unitData, null, 2)}</pre>
    </div>
  );
};

export default DebugComponent;
