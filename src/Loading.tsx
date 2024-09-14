import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import "primereact/resources/themes/lara-light-purple/theme.css"; // PrimeReact theme
import "./Loading.css";

const Loading = () => {
  return (
    <div className="spinner">
      <ProgressSpinner />
    </div>
  );
};

export default Loading;
