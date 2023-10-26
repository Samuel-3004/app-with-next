import { Progress } from "@/components/ui/progress";

const Loading = () => {
  return (
    <div className="flex">
      <Progress value={5} />
    </div>
  );
};

export default Loading;
