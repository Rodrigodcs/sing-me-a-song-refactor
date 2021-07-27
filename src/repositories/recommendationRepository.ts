import connection from "../database";


interface Song {
  name: string;
  youtubeLink: string;
  score: number;
}

interface ChangeScoreParams {
  id:number;
  increment:number;
}

export async function create(song:Song) {
  const {name,youtubeLink,score}= song
  await connection.query(
    `
    INSERT INTO recommendations
    (name, "youtubeLink", score)
    VALUES
    ($1, $2, $3)
  `,
    [name, youtubeLink, score]
  );
}

export async function findById(id: number): Promise<Song> {
  const result = await connection.query(
    `
    SELECT * FROM recommendations WHERE id = $1
  `,
    [id]
  );

  return result.rows[0];
}



export async function incrementScore(changeScore:ChangeScoreParams) {
  const {increment,id}=changeScore
  return await connection.query(
    `
    UPDATE recommendations SET score = score + $1 WHERE id = $2
  `,
    [increment, id]
  );
}

export async function destroy(id: number) {
  return await connection.query(
    `
    DELETE FROM recommendations WHERE id = $1
  `,
    [id]
  );
}


export async function findRecommendations(
  minScore: number,
  maxScore: number = Infinity,
  orderBy: string = ""
): Promise<Song[]> {
  let where = "";
  let params = [minScore];

  if (maxScore === Infinity) {
    where = "score >= $1";
  } else {
    where = "score BETWEEN $1 AND $2";
    params.push(maxScore);
  }

  let query = `SELECT * FROM recommendations WHERE ${where}`;

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  const result = await connection.query(query, params);

  return result.rows;
}
