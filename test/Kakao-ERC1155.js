const { expect } = require('chai')

describe('KaKaoERC1155', function () {
    let KaKaoERC1155, kaKaoERC1155, owner, tommy, cris

    beforeEach(async function () {
        KaKaoERC1155 = await ethers.getContractFactory('KaKaoERC1155')
        ;[owner, tommy, cris] = await ethers.getSigners()
        kaKaoERC1155 = await KaKaoERC1155.deploy('https://ipfs.savvycom/')
        await kaKaoERC1155.deployed()
    })

    it('1.Should return the correct owner', async function () {
        expect(await kaKaoERC1155.owner()).to.equal(owner.address)
    })

    it('2.Should mint tokens to a user', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(10)
    })

    it('3.Should not allow non-owners to mint tokens', async function () {
        await expect(
            kaKaoERC1155.connect(tommy).mint(tommy.address, 1, 10, '0x')
        ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('4.Should transfer tokens from one user to another', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await kaKaoERC1155
            .connect(owner)
            .safeTransferFrom(owner.address, tommy.address, 1, 5, '0x')
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(5)
        expect(await kaKaoERC1155.balanceOf(tommy.address, 1)).to.equal(5)
    })

    it('5.Should not allow transfers to be made by non-owners', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await expect(
            kaKaoERC1155
                .connect(tommy)
                .safeTransferFrom(owner.address, cris.address, 1, 5, '0x')
        ).to.be.revertedWith('ERC1155: caller is not token owner or approved')
    })

    it('6.Should allow users to approve transfers to other users', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await kaKaoERC1155.connect(owner).setApprovalForAll(tommy.address, true)
        await kaKaoERC1155
            .connect(tommy)
            .safeTransferFrom(owner.address, cris.address, 1, 5, '0x')
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(5)
        expect(await kaKaoERC1155.balanceOf(cris.address, 1)).to.equal(5)
    })

    it('7.Should allow users to get the balance of their tokens', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(10)
    })

    it('8.Should allow users to get the balance of multiple tokens', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await kaKaoERC1155.mint(owner.address, 2, 20, '0x')
        const balances = await kaKaoERC1155.balanceOfBatch(
            [owner.address, owner.address],
            [1, 2]
        )
        expect(balances[0]).to.equal(10)
        expect(balances[1]).to.equal(20)
    })

    it('9.Should allow users to get the URI for a token', async function () {
        await kaKaoERC1155.setURI('https://savvycom-uri/')
        expect(await kaKaoERC1155.uri(1)).to.equal('https://savvycom-uri/1')
    })

    it('10.Should not allow non-owners to set the URI for a token', async function () {
        await expect(
            kaKaoERC1155.connect(tommy).setURI('https://savvycom-uri/update')
        ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('11.Should revert when users try to transfer more tokens than they own', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await expect(
            kaKaoERC1155.safeTransferFrom(
                owner.address,
                tommy.address,
                1,
                20,
                '0x'
            )
        ).to.be.revertedWith('ERC1155: insufficient balance for transfer')
    })

    it('12.Should revert when users try to transfer tokens to a zero address', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await expect(
            kaKaoERC1155.safeTransferFrom(
                owner.address,
                '0x0000000000000000000000000000000000000000',
                1,
                5,
                '0x'
            )
        ).to.be.revertedWith('ERC1155: transfer to the zero address')
    })

    it('13.Should allow users to transfer tokens they own', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await kaKaoERC1155.safeTransferFrom(
            owner.address,
            tommy.address,
            1,
            5,
            '0x'
        )
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(5)
        expect(await kaKaoERC1155.balanceOf(tommy.address, 1)).to.equal(5)
    })

    it('14.Should revert when users try to transfer tokens that do not exist', async function () {
        await expect(
            kaKaoERC1155.safeTransferFrom(
                owner.address,
                tommy.address,
                1,
                5,
                '0x'
            )
        ).to.be.revertedWith('ERC1155: insufficient balance for transfer')
    })

    it('15.Should emit the ApprovalForAll event when a user approves another user to spend their tokens', async function () {
        await expect(kaKaoERC1155.setApprovalForAll(tommy.address, true))
            .to.emit(kaKaoERC1155, 'ApprovalForAll')
            .withArgs(owner.address, tommy.address, true)
        expect(
            await kaKaoERC1155.isApprovedForAll(owner.address, tommy.address)
        ).to.be.true
    })

    it('16.Should revert when users try to mint multiple tokens at once with inconsistent lengths', async function () {
        await expect(
            kaKaoERC1155.batchMint(owner.address, [1, 2, 3], [10, 20], '0x')
        ).to.be.revertedWith('ERC1155: ids and amounts length mismatch')
    })

    it('17.Should allow users to mint multiple tokens at once', async function () {
        await kaKaoERC1155.batchMint(
            owner.address,
            [1, 2, 3],
            [10, 20, 30],
            '0x'
        )
        expect(await kaKaoERC1155.balanceOf(owner.address, 1)).to.equal(10)
        expect(await kaKaoERC1155.balanceOf(owner.address, 2)).to.equal(20)
        expect(await kaKaoERC1155.balanceOf(owner.address, 3)).to.equal(30)
    })

    it('18.Should emit the TransferBatch event when a user transfers multiple tokens', async function () {
        await kaKaoERC1155.batchMint(owner.address, [1, 2], [10, 20], '0x')
        const receipt = await kaKaoERC1155.safeBatchTransferFrom(
            owner.address,
            tommy.address,
            [1, 2],
            [5, 10],
            '0x'
        )
        const transferEvent = await receipt.wait()
        expect(transferEvent.events[0].args['from']).to.equal(owner.address)
        expect(transferEvent.events[0].args['to']).to.equal(tommy.address)
    })

    it('19.Should emit the TransferSingle event when a user transfers a single token', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        const receipt = await kaKaoERC1155.safeTransferFrom(
            owner.address,
            tommy.address,
            1,
            5,
            '0x'
        )
        const transferEvent = await receipt.wait()
        expect(transferEvent.events[0].args['from']).to.equal(owner.address)
        expect(transferEvent.events[0].args['to']).to.equal(tommy.address)
        expect(transferEvent.events[0].args['id']).to.equal(1)
        expect(transferEvent.events[0].args['value']).to.equal(5)
    })

    it('20.Should allow users to get the balance of multiple tokens', async function () {
        await kaKaoERC1155.mint(owner.address, 1, 10, '0x')
        await kaKaoERC1155.mint(owner.address, 2, 20, '0x')
        const balances = await kaKaoERC1155.balanceOfBatch(
            [owner.address, owner.address],
            [1, 2]
        )
        expect(balances[0]).to.equal(10)
        expect(balances[1]).to.equal(20)
    })
})
