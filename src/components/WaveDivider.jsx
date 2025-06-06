// src/components/WaveDivider.jsx
export default function WaveDivider() {
  return (
    <div className="wave-divider">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,224L60,213.3C120,203,240,181,360,160C480,139,600,117,720,112C840,107,960,117,1080,128C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="#000"
        />
      </svg>
    </div>
  );
}
