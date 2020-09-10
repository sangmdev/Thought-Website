export interface IGuild {
  members: [{
    character: {
      name: string;
      playable_class: {
        id: number;
      };
    }
    rank: number;
  }]

}
