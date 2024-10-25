export default {
  async fetch(request, env) {

    if (request.method === 'OPTIONS') {
      // Preflight request. Reply successfully:
      return new Response("OK", {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, access-control-allow-headers, access-control-allow-methods, access-control-allow-origin',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    if (request.method !== 'GET') {
      throw new Error("Error!");
    }

    const { searchParams } = new URL(request.url)
    let movie = searchParams.get('movie') || undefined;
    if (!movie){
      throw new Error("Error!");
    }

    const tasks = [];

    let simple = {
      prompt: `Can you provide me summary of the movie ${movie} in less than 8000 characters please? Please provide an answer strictly in the Format "Summary": answer`
    };
    let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', simple);
    tasks.push({ inputs: simple, response });

    return new Response( 
      JSON.stringify(tasks[0].response),
      {
        headers: {
        'Access-Control-Allow-Origin': '*'}
      }
    )
  }
};