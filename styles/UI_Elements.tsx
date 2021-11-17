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

export const StartButton = styled.div`
  position: absolute;
  top: 40%;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
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

export const Item = styled.div`
  width: 20%;
  height: calc(100vh/20);
  background-color: lightgreen;
`;