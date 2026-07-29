import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

const hobbies = [
  "ゲーム",
  "アニメ",
  "映画",
  "旅行",
  "音楽",
  "スポーツ",
  "読書",
  "料理",
  "カフェ",
  "ラーメン",
  "寿司",
  "猫",
  "犬",
  "プログラミング",
  "テクノロジー",
  "YouTube",
  "漫画",
  "VTuber",
  "カラオケ",
  "写真",
  "ファッション",
  "車",
  "バイク",
  "サッカー",
  "野球",
  "キャンプ",
  "登山",
  "ボードゲーム",
  "コーヒー",
  "お菓子",
];

function App() {
  const [page, setPage] = useState("profile");
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

  useEffect(() => {
    if (page !== "scan") return;

    let scanner;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("reader");

        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText) => {
            try {
              const profile = JSON.parse(decodedText);

              setPartnerProfile(profile);

              await scanner.stop();

              setPage("result");
            } catch (err) {
              console.error(err);
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    startScanner();

    return () => {
      if (
        scanner &&
        scanner.isScanning
      ) {
        scanner.stop().catch(() => {});
      }
    };
  }, [page]);

  const saveProfile = () => {
    const profile = {
      name,
      hobbies: selectedHobbies,
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(profile)
    );
  };

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(
        selectedHobbies.filter(
          (h) => h !== hobby
        )
      );
    } else {
      setSelectedHobbies([
        ...selectedHobbies,
        hobby,
      ]);
    }
  };

  const commonHobbies =
    Array.isArray(partnerProfile?.hobbies)
      ? partnerProfile.hobbies.filter(
          (hobby) =>
            selectedHobbies.includes(hobby)
        )
      : [];

  return (
    <div className="app">
      <div className="header">
        プロフィール
      </div>

      {page === "profile" && (
        <div className="card">
          <h2>名前</h2>

          <input
            className="input-box"
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="名前を入力"
          />

          <h2 className="section-title">
            好きなもの・趣味
          </h2>

          <div className="hobby-grid">
            {hobbies.map((hobby) => (
              <label
                key={hobby}
                className={`hobby-tag ${
                  selectedHobbies.includes(
                    hobby
                  )
                    ? "selected"
                    : ""
                }`}
              >
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
            ))}
          </div>

          <button
            className="save-button"
            onClick={() => {
              saveProfile();
              setPage("qr");
            }}
          >
            次へ
          </button>
        </div>
      )}

      {page === "qr" && (
        <div className="card">
          <h2 style={{ textAlign: "center" }}>
            あなたのQRコード
          </h2>

          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <QRCodeSVG
              value={JSON.stringify({
                name,
                hobbies: selectedHobbies,
              })}
              size={260}
            />
          </div>

          <button
            className="save-button"
            onClick={() =>
              setPage("scan")
            }
          >
            相手のQRを読み取る
          </button>

          <button
            className="save-button"
            onClick={() =>
              setPage("profile")
            }
          >
            戻る
          </button>
        </div>
      )}

      {page === "scan" && (
        <div className="card">
          <h2 style={{ textAlign: "center" }}>
            相手のQRコードを読み取る
          </h2>

          <p
            style={{
              textAlign: "center",
            }}
          >
            相手のQRコードを
            枠の中に合わせてください
          </p>

          <div className="scanner-container">
            <div id="reader"></div>
          </div>

          <button
            className="save-button"
            onClick={() =>
              setPage("qr")
            }
          >
            戻る
          </button>
        </div>
      )}

      {page === "result" && (
        <div className="card">
          <h2>🎉 共通点発見！</h2>

          <p>
            相手：
            {partnerProfile?.name}
          </p>

          {commonHobbies.length > 0 ? (
            <div className="hobby-grid">
              {commonHobbies.map(
                (hobby) => (
                  <div
                    key={hobby}
                    className="hobby-tag selected"
                  >
                    ✅ {hobby}
                  </div>
                )
              )}
            </div>
          ) : (
            <p>
              共通点はまだ見つかりませんでした
            </p>
          )}

          <button
            className="save-button"
            onClick={() =>
              setPage("profile")
            }
          >
            はじめから
          </button>
        </div>
      )}
    </div>
  );
}

export default App;