import React from "react";

export default function FastMoneyHelp() {
  return (
    <ul className="help-list">
      <li>The winning family chooses two players to play Fast Money.</li>
      <li>One player leaves the room while the other plays.</li>
      <li>The first player answers five survey questions in 20 seconds.</li>
      <li>
        Each answer earns points based on how popular it was in the survey.
      </li>
      <li>After all five questions, the first player’s score is recorded.</li>
      <li>The second player returns and answers the same five questions in 25 seconds.</li>
      <li>
        If the second player gives the same answer, I will make this sound(*host makes sound with mouth*), and they must choose a different
        one.
      </li>
      <li>
        The second player’s points are added to the first player’s points.
      </li>
      <li>
        If the combined total reaches 200 points, the family wins Fast
        Money.
      </li>
    </ul>
  );
}
