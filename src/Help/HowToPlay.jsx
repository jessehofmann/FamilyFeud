import React from "react";

export default function HowToPlay() {
  return (
    <ul className="help-list">
      <li>
        Two families compete to guess the most popular answers to survey
        questions.
      </li>

      <li>One player from each family faces off by buzzing in first.</li>
      <li>The player who buzzes in gives an answer.</li>
      <li>
        If their answer is the highest on the board, their family gains control.
      </li>
      <li>If not, the other family gets a chance to steal control.</li>
      <li>The controlling family takes turns giving answers.</li>
      <li>Correct answers reveal points based on popularity.</li>
      <li>Three wrong answers earn three strikes and end the round.</li>
      <li>
        The other family can steal by giving one remaining correct answer.
      </li>
      <li>
        If the steal is successful, that family earns all the points for the
        round.
      </li>
      <li>The first family to 300 points goes to fast money.</li>
    </ul>
  );
}
