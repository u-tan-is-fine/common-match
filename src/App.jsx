import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

const hobbies = [
  "ゲーム",
  "アニメ",
  "映画",
  "旅行",
  "音楽",
  "スポーツ",
];

function App() {
  const [name, setName] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [partnerProfile, setPartnerProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);

      setName(profile.name || "");
      setSelectedHobbies(profile.hobbies || []);
    }
  }, []);

  const saveProfile = () => {
    const profile = {
      name,
      hobbies: selectedHobbies,
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(profile)
    );

    alert("プロフィールを保存しました");
  };
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const profile = JSON.parse(decodedText);

          setPartnerProfile(profile);

          scanner.clear();
        } catch (error) {
          console.error(error);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(
        selectedHobbies.filter((h) => h !== hobby)
      );
    } else {
      setSelectedHobbies([
        ...selectedHobbies,
        hobby,
      ]);
    }
  };
  const commonHobbies =
    partnerProfile?.hobbies?.filter((hobby) =>
      selectedHobbies.includes(hobby)
    ) || [];
  return (
    <div style={{ padding: "20px" }}>
      <h1>共通点マッチ</h1>

      <div>
        <p>名前</p>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="名前を入力"
        />
      </div>

      <h2>趣味</h2>

      {hobbies.map((hobby) => (
        <div key={hobby}>
          <label>
            <input
              type="checkbox"
              checked={selectedHobbies.includes(
                hobby
              )}
              onChange={() =>
                toggleHobby(hobby)
              }
            />
            {hobby}
          </label>
        </div>
      ))}

      <button onClick={saveProfile}>
        保存
      </button>

      <hr />
      <h2>あなたのQRコード</h2>

      <QRCodeSVG
        value={JSON.stringify({
          name,
          hobbies: selectedHobbies,
        })}
        size={200}
      />
      <h2>相手のQRコードを読み取る</h2>

      <div id="reader"></div>

      <h3>現在の入力内容</h3>

      <p>名前: {name}</p>

      <p>
        趣味:
        {selectedHobbies.join("、")}
      </p>

      
      {partnerProfile && (
        <>
          <hr />

          <h2>マッチ結果</h2>

          <p>相手: {partnerProfile.name}</p>

          <p>
            共通点:
            {" "}
            {commonHobbies.join("、")}
          </p>

          <p>
            共通数:
            {" "}
            {commonHobbies.length}
          </p>
        </>
      )}
      </div>

  );
}

export default App;