export default function Judgement({ judgement }) {
    return (
      <section>
        <h2>Judgement</h2>
        <div className="judgement">
          {judgement.content.startsWith('An error occurred:') ? (
            <p className="error">Error: {judgement.content}</p>
          ) : (
            <>
              <p>
                <strong>Winner:</strong> {judgement.winner}
              </p>
              <p>
                <strong>Winning Argument:</strong> {judgement.winning_argument}
              </p>
              <p>
                <strong>Loser:</strong> {judgement.loser}
              </p>
              <p>
                <strong>Losing Argument:</strong> {judgement.losing_argument}
              </p>
              <p>
                <strong>Reasoning:</strong> {judgement.reasoning}
              </p>
            </>
          )}
        </div>
      </section>
    );
  }