
Z80 = {
	//time clock m and t
	_clock: {m:0, t:0},

	//registers of the Z80
	_r: {
		a:0, b:0, c:0, d:0, e:0, h:0, l:0, f:0, /*F is a flag register producres Zero, Operation, Halfcarry and carry*/
		pc:0, sp:0,
		m:0, t:0
	},

	//adds e to a nad leaves result in reg a
	ADDr_e: function(){
		Z80._r.a += Z80._r.e; //add
		z80._r.f = 0; //clear flag
		if(!(Z80._r.a & 255)) Z80._r.f |=0x80; //check for zero
		if(Z80._r.a > 255) Z80._r.f |= 0x10; //check for a carry
		Z80._r.a &= 255; //mask bits into a
		//update time regs
		Z80._r.m = 1;
		Z80._r.t = 4; 
	},
	// Compare function: comp b to a and sets compare flag
	CPr_b: function(){
		var i = Z80._r.a; // copy a
		i -= Z80._r.b; // subtract b from temp_a
		Z80._r.f |= 0x40; //set sub flag
		if(!(i & 255)) Z80._r.f |= 0x80; //check zero
		if(i<0) Z80._r.f |= 10; //check underflow
		//Update time regs
		Z80._r.m = 1; 
		Z80._r.t = 4;
	}
	//NOP function
	NOP: function(){
		//update time regs
		Z80._r.m = 1; Z80._r.t = 4;
	},
	// push to stack b and C
	PUSHBC: function(){
		Z80._r.sp--;  //decrement stack pointer
		MMU.wb(Z80._r.sp, Z80._r.b);
}
