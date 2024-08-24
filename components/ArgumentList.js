export default function ArgumentList({ arguments }) {
  return (
    <section>
      <h2>Arguments</h2>
      {arguments && arguments.length > 0 ? (
        arguments.map((argument) => (
          <div key={argument.id} className="argument">
            <h3>Argument by {argument.username}</h3>
            <p>{argument.content}</p>
            {argument.image_url && (
              <img src={argument.image_url} alt="Argument image" />
            )}
          </div>
        ))
      ) : (
        <p>No arguments submitted yet.</p>
      )}
    </section>
  );
}
