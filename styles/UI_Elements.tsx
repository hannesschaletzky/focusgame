import styled from "styled-components";

export const Input = styled.input`
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 8px;
  outline: none;
  text-align: center;
`;

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
    opacity: 0.6;
    cursor: wait;
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

export const Points = styled(Overlay)`
  top: 40%;
  font-size: 10rem;
  opacity: 0.2;
`;

export const Seconds = styled(Overlay)`
  bottom: 5%;
  font-size: 5rem;
  opacity: 0.1;
`;
