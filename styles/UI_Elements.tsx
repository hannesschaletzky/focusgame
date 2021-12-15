import styled from "styled-components";

export const Input = styled.input`
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 8px;
  outline: none;
`;

export const Button = styled.a`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #1e911e;
  color: white;
  box-shadow: 2px 2px darkgray;
  border-radius: 8px;
  cursor: pointer;

  &:active {
    box-shadow: none;
  }
`;

/* START */
export const StartButton = styled.div`
  height: 50px;
  width: 100px;

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
`;

/* GAME */
interface ItemProps {
  color: string;
  height: number;
}
export const Item = styled.div<ItemProps>`
  width: 20%;
  height: calc(100vh / ${({ height }) => height});
  background-color: ${({ color }) => color};
`;

export const Points = styled.div`
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  //width: 10%;
  text-align: center;
  font-size: 10rem;
  opacity: 0.2;
  z-index: 1;
  pointer-events: none;
`;

export const Seconds = styled.div`
  position: absolute;
  bottom: 5%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  //width: 10%;
  text-align: center;
  font-size: 5rem;
  opacity: 0.1;
  z-index: 1;
  pointer-events: none;
`;
