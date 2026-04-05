import React from "react";

export default function MembersPage() {
  return (
    <div style={{
      maxWidth: 650,
      margin: "0 auto",
      padding: "30px 0",
      color: "#fff7e6"
    }}>
      <h2 style={{
        color: "#FFD782",
        fontWeight: 800,
        fontSize: "2.2em",
        textAlign: "center",
        marginBottom: 38,
        letterSpacing: ".02em"
      }}>
        Organisation du Club Ciné
      </h2>
      {/* Direction */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "42px", marginBottom: 4
      }}>
        <div style={{ textAlign: "center", minWidth: 165 }}>
          <div style={{
            fontWeight: 800,
            fontSize: "1.15em",
            color: "#FFD782",
            lineHeight: "1.33"
          }}>
            Présidente du club
          </div>
          <div style={{
            fontWeight: 600,
            fontSize: "1.08em",
            color: "#fff7e6",
            marginTop: 1
          }}>
            Anaïs Boisson
          </div>
        </div>
        <div style={{
          borderLeft: "2px solid #FFD78255",
          height: 52, margin: "0 14px"
        }} />
        <div style={{ textAlign: "center", minWidth: 165 }}>
          <div style={{
            fontWeight: 800,
            fontSize: "1.15em",
            color: "#FFD782",
            lineHeight: "1.33"
          }}>
            Co-Président
          </div>
          <div style={{
            fontWeight: 600,
            fontSize: "1.08em",
            color: "#fff7e6",
            marginTop: 1
          }}>
            Paul-Emile Martin Grandvoinnet
          </div>
        </div>
      </div>
      {/* Arborescence - traits */}
      <svg width="100%" height="20">
        <line x1="20%" y1="8" x2="20%" y2="20" stroke="#FFD782" strokeWidth="2" />
        <line x1="50%" y1="8" x2="50%" y2="20" stroke="#FFD782" strokeWidth="2" />
        <line x1="80%" y1="8" x2="80%" y2="20" stroke="#FFD782" strokeWidth="2" />
        <line x1="20%" y1="20" x2="80%" y2="20" stroke="#FFD782" strokeWidth="2" />
      </svg>
      {/* Equipe */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
        gap: "20px 0"
      }}>
        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px",
          marginBottom: 7
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Responsable Apéro/Binouze</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em",
            marginTop: 1
          }}>Anthony Dinh</div>
        </div>
        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px",
          marginBottom: 7
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Responsable communication</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em",
            marginTop: 1
          }}>Nathan Ramelet</div>
        </div>



        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px",
          marginBottom: 7
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Trésorier</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em"
          }}>Antony Dinh</div>
        </div>
        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px",
          marginBottom: 7
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Maintenance du site web</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em"
          }}>Nathan Ramelet</div>
        </div>
        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px",
          marginBottom: 7
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Graphiste</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em"
          }}>Maeva Ramamonji</div>
        </div>
        <div style={{
          width: "45%",
          background: "#37252936",
          borderRadius: 9,
          padding: "18px 14px"
        }}>
          <div style={{
            fontWeight: 700,
            color: "#FFD782",
            fontSize: "1.13em"
          }}>Responsable Événement</div>
          <div style={{
            fontWeight: 500,
            color: "#fff7e6",
            fontSize: "1em"
          }}>Anaïs Boisson</div>
        </div>
      </div>
    </div>
  );
}
