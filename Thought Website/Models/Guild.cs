using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Thought_Website.Models
{
    public class Guild
    {
        public ICollection<Member> members { get; set; }
        public int rank { get; set; }
    }
}
