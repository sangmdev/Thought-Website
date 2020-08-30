export interface IRaiderIoCharacterGuildData {
  achievement_points: Number
  active_spec_name: String
  active_spec_role: String
  class: String
  faction: String
  gender: String
  guild: {name: String, realm: String}
  honorable_kills: Number
  name: String
  profile_banner: String
  profile_url: String
  race: String
  realm: String
  region: String
  thumbnail_url: String
  mythic_plus_scores_by_season: [{
    season: String,
    scores: {
      all: Number,
      dps: Number,
      healer: Number,
      tank: Number,
      spec_0: Number,
      spec_1: Number,
      spec_2: Number,
      spec_3: Number
    }
  }]
}
