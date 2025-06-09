import { useListCoursesQuery } from "./api/coursesApi";

export default function App() {
  const { data = [], isLoading } = useListCoursesQuery({});
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Courses</h1>
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
