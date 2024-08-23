export default function ArgumentList({ sessionArguments }) {
    return (
      <section>
        <h2>Arguments</h2>
        {sessionArguments && sessionArguments.length > 0 ? (
          sessionArguments.map((sessionArguments) => (
            <div key={sessionArguments.id} className="argument">
              <h3>Argument by {sessionArguments.username}</h3>
              <p>{sessionArguments.content}</p>
              {sessionArguments.image_url && <img src={sessionArguments.image_url} alt="Argument image" />}
            </div>
          ))
        ) : (
          <p>No arguments submitted yet.</p>
        )}
      </section>
    );
  }