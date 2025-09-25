export default function StreamingLinks({ movie }) {
  const platforms = [
    {
      name: "فیلیمو",
      url: `https://www.filimo.com/search/${encodeURIComponent(movie.Title)}`,
      color: "#FF6B35",
      logo: "https://ecosystem.ir/media/logo/ee93b079-5609-11e9-b9f2-0024d7bec390.png",
      type: "iranian",
    },
    {
      name: "نماوا",
      url: `https://www.namava.ir/search?query=${encodeURIComponent(
        movie.Title
      )}`,
      color: "#00ACC1",
      logo: "https://logoyab.com/wp-content/uploads/2024/07/Namava-Logo-1030x1030.png",
      type: "iranian",
    },

    {
      name: "نتفلیکس",
      url: `https://www.netflix.com/search?q=${encodeURIComponent(
        movie.Title
      )}`,
      color: "#E50914",
      logo: "https://myket.ir/app-icon/com.netflix.mediaclient_97bc3892-cf04-4139-9761-4f00f807efbf.png",
      type: "international",
    },
    {
      name: "Prime Video",
      url: `https://www.primevideo.com/search?query=${encodeURIComponent(
        movie.Title
      )}`,
      color: "#00A8E1",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Amazon_Prime_Video_logo_%282024%29.svg/768px-Amazon_Prime_Video_logo_%282024%29.svg.png?20240816090318",
      type: "international",
    },

    {
      name: "جستجوی گوگل",
      url: `https://www.google.com/search?q=${encodeURIComponent(
        movie.Title + " " + movie.Year + " تماشای آنلاین"
      )}`,
      color: "#4285F4",
      logo: "https://icon2.cleanpng.com/lnd/20241121/sc/bd7ce03eb1225083f951fc01171835.webp",
      type: "search",
    },
    {
      name: "یوتیوب",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        movie.Title + " " + movie.Year + " full movie"
      )}`,
      color: "#FF0000",
      logo: "https://www.freeiconspng.com/uploads/hd-youtube-logo-png-transparent-background-20.png",
      type: "search",
    },
  ];

  const iranianPlatforms = platforms.filter((p) => p.type === "iranian");
  const internationalPlatforms = platforms.filter(
    (p) => p.type === "international"
  );
  const searchPlatforms = platforms.filter((p) => p.type === "search");

  return (
    <div className="streaming-section">
      <h3>🎬 تماشای آنلاین</h3>

      <div className="platforms-grid">
        <div className="platform-group">
          <h4>🇮🇷 پلتفرم‌های ایرانی</h4>
          <div className="platforms-list">
            {iranianPlatforms.map((platform) => (
              <PlatformLink key={platform.name} platform={platform} />
            ))}
          </div>
        </div>

        <div className="platform-group">
          <h4>🌎 پلتفرم‌های خارجی</h4>
          <div className="platforms-list">
            {internationalPlatforms.map((platform) => (
              <PlatformLink key={platform.name} platform={platform} />
            ))}
          </div>
        </div>

        <div className="platform-group">
          <h4>🔍 گوگل و یوتیوب</h4>
          <div className="platforms-list">
            {searchPlatforms.map((platform) => (
              <PlatformLink key={platform.name} platform={platform} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformLink({ platform }) {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="platform-link"
      style={{
        "--platform-color": platform.color,
        "--platform-color-light": platform.color + "20",
      }}
    >
      <div className="platform-logo-container">
        <img
          src={platform.logo}
          alt={`${platform.name} logo`}
          className="platform-logo"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = e.target.nextSibling;
            if (fallback) {
              fallback.style.display = "flex";
              fallback.textContent = getFallbackEmoji(platform.name);
            }
          }}
        />
        <span className="platform-logo-fallback"></span>
      </div>
      <span className="platform-name">{platform.name}</span>
    </a>
  );
}

function getFallbackEmoji(platformName) {
  const emojiMap = {
    فیلیمو: "🎬",
    نماوا: "📺",
    نتفلیکس: "🔴",
    "Prime Video": "📦",
    یوتیوب: "▶️",
    "جستجوی گوگل": "🔍",
  };
  return emojiMap[platformName] || "📱";
}
