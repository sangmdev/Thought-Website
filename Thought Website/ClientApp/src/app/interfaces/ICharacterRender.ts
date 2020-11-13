export interface ICharacterRender {
  render_url: string;
  assets: {
    key: string;
    value: string;
  }[]
  character : {
    name: string;
  }
}
