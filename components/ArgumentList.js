export default function ArgumentList({ sessionArguments }) {
  return (
    <section>
      <h2>Arguments</h2>
      {sessionArguments && sessionArguments.length > 0 ? (
        sessionArguments.map((argument) => (
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
