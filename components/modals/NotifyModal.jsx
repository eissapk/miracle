export default function NotifyModal({ desc, className }) {
  return (
    <div className={`NotifyModal${className ? ' ' + className : ''}`}>
      {desc}
    </div>
  );
}
