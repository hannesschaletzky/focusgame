import styled from "styled-components";

export const StartButton = styled.button`
  height: 50px;
  min-width: 100px;
  padding: 0 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: orange;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 1px 1px gray;

  &:active {
    box-shadow: none;
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
  }
`;

/* GAME */
export const Cell = styled.div<{ $color: string }>`
  width: 20%;
  height: 5%;
  background-color: ${({ $color }) => $color};
  touch-action: manipulation;
  user-select: none;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
  pointer-events: none;
  user-select: none;
`;

// Punkte genau in der Bildschirmmitte
export const Points = styled(Overlay)`
  top: 50%;
  transform: translateY(-50%);
  font-size: 10rem;
  line-height: 1;
  opacity: 0.2;
`;

// Kurzes rotes Aufblinken nach einem Fehlklick
export const MissFlash = styled.div<{ $ms: number }>`
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-color: red;
  animation: miss-flash ${({ $ms }) => $ms}ms ease-out forwards;

  @keyframes miss-flash {
    from {
      opacity: 0.35;
    }
    to {
      opacity: 0;
    }
  }
`;

// Restzeit klein oben links
export const Seconds = styled(Overlay)`
  top: 0.75rem;
  left: 1rem;
  right: auto;
  text-align: left;
  font-size: 1.5rem;
  opacity: 0.4;
`;
