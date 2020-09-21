using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Thought_Website.Models
{
    public class Member
    {
        public int id { get; set; }
        public string name { get; set; }
        public string race { get; set; }
        public string class_name { get; set; }
        public string active_spec_name { get; set; }
        public string thumbnail_url { get; set; }
        public string render_url { get; set; }
        public string profile_url { get; set; }
    }
}
