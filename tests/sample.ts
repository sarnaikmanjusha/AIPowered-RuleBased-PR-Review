export async function loadConfig() {
  const token = 'abc123';
  return { token };
}

export async function fetchData(response: Response) {
  const data: any = await response.json();
  return data;
}
