
MMU = {
    rb: function(addr){/*read 8-bitd from addr*/},
    rw: function(addr){},//write to 16 bit addr,

    wb: function(addr, val){},//write to 8 bit addr
    ww: function(addr, val){}, //write 16bit to addr
};