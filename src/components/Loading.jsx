import { ring } from "ldrs";
ring.register();
export const Loading = () => {
  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      <l-ring
        size="50"
        stroke="8"
        bg-opacity="0.2"
        speed="2"
        color="#5838fc"
      ></l-ring>
    </div>
  );
};
