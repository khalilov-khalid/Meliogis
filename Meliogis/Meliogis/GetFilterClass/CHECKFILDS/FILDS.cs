using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Meliogis.GetFilterClass.CHECKFILDS
{
    // Aciq Suvarma sebekesi
    public class CHANNEL
    {
        public bool CH { get; set; }
        public CHANNELFILDS CHANNELFILDS { get; set; }
    }
    //Aciq suvarma sebekesinin fildleri
    public class CHANNELFILDS
    {
        public bool CHM { get; set; }
        public bool CHI { get; set; }
        public bool CHII { get; set; }
        public bool CHIII { get; set; }
    }

    // Qapali suvarma sebekesi
    public class QCHANNEL
    {
        public bool QCH { get; set; }
        public QCHANNELFILDS QCHANNELFILDS { get; set; }
    }

    // Qapali suvarma sebekesinin fildleri
    public class QCHANNELFILDS
    {
        public bool QCHM { get; set; }
        public bool QCHI { get; set; }
        public bool QCHII { get; set; }
        public bool QCHIII { get; set; }
    }

    // Drenajlar 
    public class DRENAJ
    {
        public bool DREN { get; set; }
        public DRENAJFILDS DRENAJFILDS { get; set; }
    }

    public class DRENAJFILDS
    {
        public bool DRENAJM { get; set; }
        public bool DRENAJI { get; set; }
        public bool DRENAJII { get; set; }
        public bool DRENAJK { get; set; }
    }






}